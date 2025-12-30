/**
 * Payroll Module Object Stores
 *
 * Creates stores for payroll processing system.
 * Covers: Periods, Salary Structures, Allowances, Advances, Loans, Overtime, Payslips
 */

import type { IDBPDatabase } from 'idb';
import type { VDODatabase } from '@/types/db/stores';

/**
 * Create all payroll-related object stores
 */
export function createPayrollStores(db: IDBPDatabase<VDODatabase>): void {
  // Payroll Periods store
  if (!db.objectStoreNames.contains('payrollPeriods')) {
    const store = db.createObjectStore('payrollPeriods', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('periodCode', 'periodCode', { unique: true });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('year', 'year', { unique: false });
    store.createIndex('month', 'month', { unique: false });
    store.createIndex('startDate', 'startDate', { unique: false });
    console.log('Created store: payrollPeriods');
  }

  // Salary Structures store
  if (!db.objectStoreNames.contains('salaryStructures')) {
    const store = db.createObjectStore('salaryStructures', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('componentCode', 'componentCode', { unique: true });
    store.createIndex('componentType', 'componentType', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('applicableTo', 'applicableTo', { unique: false });
    console.log('Created store: salaryStructures');
  }

  // Employee Salary Details store
  if (!db.objectStoreNames.contains('employeeSalaryDetails')) {
    const store = db.createObjectStore('employeeSalaryDetails', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('effectiveFrom', 'effectiveFrom', { unique: false });
    store.createIndex('isCurrent', 'isCurrent', { unique: false });
    store.createIndex('employeeId_isCurrent', ['employeeId', 'isCurrent'], { unique: false });
    console.log('Created store: employeeSalaryDetails');
  }

  // Employee Allowances store
  if (!db.objectStoreNames.contains('employeeAllowances')) {
    const store = db.createObjectStore('employeeAllowances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('salaryComponentId', 'salaryComponentId', { unique: false });
    store.createIndex('isActive', 'isActive', { unique: false });
    store.createIndex('effectiveFrom', 'effectiveFrom', { unique: false });
    console.log('Created store: employeeAllowances');
  }

  // Payroll Entries store
  if (!db.objectStoreNames.contains('payrollEntries')) {
    const store = db.createObjectStore('payrollEntries', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('payrollPeriodId', 'payrollPeriodId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('department', 'department', { unique: false });
    store.createIndex('payrollPeriodId_employeeId', ['payrollPeriodId', 'employeeId'], { unique: true });
    console.log('Created store: payrollEntries');
  }

  // Salary Advances store
  if (!db.objectStoreNames.contains('salaryAdvances')) {
    const store = db.createObjectStore('salaryAdvances', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('advanceNumber', 'advanceNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('requestDate', 'requestDate', { unique: false });
    console.log('Created store: salaryAdvances');
  }

  // Advance Repayments store
  if (!db.objectStoreNames.contains('advanceRepayments')) {
    const store = db.createObjectStore('advanceRepayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('advanceId', 'advanceId', { unique: false });
    store.createIndex('payrollEntryId', 'payrollEntryId', { unique: false });
    store.createIndex('repaymentDate', 'repaymentDate', { unique: false });
    console.log('Created store: advanceRepayments');
  }

  // Employee Loans store
  if (!db.objectStoreNames.contains('employeeLoans')) {
    const store = db.createObjectStore('employeeLoans', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('loanNumber', 'loanNumber', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('loanType', 'loanType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('requestDate', 'requestDate', { unique: false });
    console.log('Created store: employeeLoans');
  }

  // Loan Repayments store
  if (!db.objectStoreNames.contains('loanRepayments')) {
    const store = db.createObjectStore('loanRepayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('loanId', 'loanId', { unique: false });
    store.createIndex('payrollEntryId', 'payrollEntryId', { unique: false });
    store.createIndex('repaymentDate', 'repaymentDate', { unique: false });
    console.log('Created store: loanRepayments');
  }

  // Overtime Records store
  if (!db.objectStoreNames.contains('overtimeRecords')) {
    const store = db.createObjectStore('overtimeRecords', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('date', 'date', { unique: false });
    store.createIndex('overtimeType', 'overtimeType', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    console.log('Created store: overtimeRecords');
  }

  // Payslips store
  if (!db.objectStoreNames.contains('payslips')) {
    const store = db.createObjectStore('payslips', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('payslipNumber', 'payslipNumber', { unique: true });
    store.createIndex('payrollEntryId', 'payrollEntryId', { unique: true });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('periodYear', 'periodYear', { unique: false });
    store.createIndex('periodMonth', 'periodMonth', { unique: false });
    console.log('Created store: payslips');
  }

  // Bank Transfers store
  if (!db.objectStoreNames.contains('bankTransfers')) {
    const store = db.createObjectStore('bankTransfers', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('batchNumber', 'batchNumber', { unique: true });
    store.createIndex('payrollPeriodId', 'payrollPeriodId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('transferDate', 'transferDate', { unique: false });
    console.log('Created store: bankTransfers');
  }

  // Cash Payments store
  if (!db.objectStoreNames.contains('cashPayments')) {
    const store = db.createObjectStore('cashPayments', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('voucherNumber', 'voucherNumber', { unique: true });
    store.createIndex('payrollEntryId', 'payrollEntryId', { unique: false });
    store.createIndex('employeeId', 'employeeId', { unique: false });
    store.createIndex('status', 'status', { unique: false });
    store.createIndex('paymentDate', 'paymentDate', { unique: false });
    console.log('Created store: cashPayments');
  }
}
