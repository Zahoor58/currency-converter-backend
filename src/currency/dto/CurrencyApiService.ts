import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryComponent } from '../../components/history/history.component';
import { HttpClientModule } from '@angular/common/http';

interface ConversionRecord {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  usedDate: string;
  timestamp: string;
}

@Component({
  selector: 'app-converter',

  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    HistoryComponent,
    HttpClientModule
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  currencies: string[] = [];
  result: number | null = null;
  rate: number | null = null;
  maxDate: Date;

  historyKey = 'conversion_history';
  history: ConversionRecord[] = [];

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private snack: MatSnackBar
  ) {
    // Set max date to 2 days ago for historical data
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 2);
    
    this.form = this.fb.group({
      from: ['USD', Validators.required],
      to: ['EUR', Validators.required],
      amount: [1, [Validators.required, Validators.min(0.01)]],
      date: [null], // optional date for historical
    });
  }

  ngOnInit() {
    this.loadCurrencies();
    this.loadHistory();
  }

  private loadCurrencies() {
    this.loading = true;
    this.currencyService.getSymbols().subscribe({
      next: (res: any) => {
        const rates = res?.data || res?.rates || {};
        this.currencies = Object.keys(rates).sort();
        
        if (!this.currencies.includes(this.form.value.from)) {
          this.form.patchValue({ from: this.currencies[0] });
        }
        if (!this.currencies.includes(this.form.value.to)) {
          this.form.patchValue({ to: this.currencies[1] || this.currencies[0] });
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        const message = err?.message || 'Failed to load currencies';
        this.snack.open(message, 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  private loadHistory() {
    const raw = localStorage.getItem(this.historyKey);
    if (raw) {
      try {
        this.history = JSON.parse(raw);
      } catch {
        this.history = [];
      }
    }
  }

  private saveHistory() {
    localStorage.setItem(this.historyKey, JSON.stringify(this.history));
  }

  convert() {
    if (this.form.invalid) {
      this.snack.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      return;
    }
    
    const { from, to, amount, date } = this.form.value;
    
    // Validate currencies are different
    if (from === to) {
      this.snack.open('Please select different currencies', 'Close', { duration: 3000 });
      return;
    }
    
    // Validate date if provided
    if (date) {
      const selectedDate = new Date(date);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > twoDaysAgo) {
        this.snack.open('Historical data is only available for dates at least 2 days in the past', 'Close', { duration: 5000 });
        return;
      }
    }
    
    const useDate = date ? this.formatDate(date) : null;
    this.loading = true;
    
    const obs = useDate 
      ? this.currencyService.getHistorical(useDate, from) 
      : this.currencyService.getLatest(from);
      
    obs.subscribe({
      next: (res: any) => {
        const data = res?.data || res?.rates || {};
        const rate = data[to];
        
        if (rate === undefined) {
          this.snack.open(`Rate for ${to} not available`, 'Close', { duration: 3000 });
          this.loading = false;
          return;
        }
        
        this.rate = +rate;
        this.result = amount * this.rate;
        
        const record: ConversionRecord = {
          from,
          to,
          amount: +amount,
          result: this.result,
          rate: this.rate,
          usedDate: useDate || 'latest',
          timestamp: new Date().toISOString()
        };
        
        this.history.unshift(record);
        this.history = this.history.slice(0, 100);
        this.saveHistory();
        this.loading = false;
        
        this.snack.open('Conversion successful!', 'Close', { duration: 2000 });
      },
      error: (err: any) => {
        console.error(err);
        const message = err?.message || 'Conversion failed. Please try again.';
        this.snack.open(message, 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  private formatDate(d: any) {
    const dateObj = new Date(d);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

  constructor(private http: HttpClient) {}

  getLatest(base?: string): Observable<any> {
    let params = new HttpParams();
    if (base) params = params.set('base', base);
    return this.http.get(`${this.baseUrl}/latest`, { params })
      .pipe(catchError(this.handleError));
  }

  getHistorical(date: string, base?: string): Observable<any> {
    let params = new HttpParams().set('date', date);
    if (base) params = params.set('base', base);
    return this.http.get(`${this.baseUrl}/historical`, { params })
      .pipe(catchError(this.handleError));
  }

  getSymbols(): Observable<any> {
    return this.http.get(`${this.baseUrl}/symbols`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.error && typeof error.error === 'object') {
        if (error.error.details) {
          errorMessage = error.error.details;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server error: ${error.status} - ${error.statusText}`;
        }
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}
