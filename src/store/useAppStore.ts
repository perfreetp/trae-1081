import { create } from 'zustand';
import type {
  Appointment,
  Survey,
  OperationPhoto,
  Bill,
  Evaluation,
  Schedule,
  Operation,
  PaymentRecord,
  Farmland,
  RefundRecord,
  BillItem,
} from '@/data/types';
import {
  mockAppointments,
  mockSurveys,
  mockOperationPhotos,
  mockBills,
  mockEvaluations,
  mockSchedules,
  mockOperations,
  mockFarmlands,
} from '@/data/mockData';

const mockPaymentRecords: PaymentRecord[] = [
  { id: 'pr1', bill_id: 'b1', amount: 1370.0, payment_method: 'wechat', payment_date: '2026-06-10', created_at: '2026-06-10 14:30:00', remark: '全额支付' },
  { id: 'pr2', bill_id: 'b2', amount: 500.0, payment_method: 'cash', payment_date: '2026-06-07', created_at: '2026-06-07 10:15:00', remark: '部分支付' },
];

const mockRefundRecords: RefundRecord[] = [];

interface AppState {
  farmlands: Farmland[];
  appointments: Appointment[];
  surveys: Survey[];
  operationPhotos: OperationPhoto[];
  bills: Bill[];
  paymentRecords: PaymentRecord[];
  refundRecords: RefundRecord[];
  evaluations: Evaluation[];
  schedules: Schedule[];
  operations: Operation[];
  
  updateFarmlandMeasuredArea: (id: string, measured_area: number) => void;
  
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointmentArea: (id: string, measured_area: number) => void;
  updateAppointmentSchedule: (appointmentId: string, scheduleId: string) => void;
  updateAppointmentBill: (appointmentId: string, billId: string) => void;
  updateAppointmentOperation: (appointmentId: string, operationId: string) => void;
  updateAppointmentSurvey: (appointmentId: string, surveyId: string) => void;
  signAppointment: (id: string, signed_by: string) => void;
  
  updateSurvey: (survey: Survey) => void;
  addSurvey: (survey: Survey) => void;
  
  addOperationPhoto: (photo: OperationPhoto) => void;
  
  addBill: (bill: Bill) => void;
  updateBillPayment: (id: string, amount: number, status?: Bill['status']) => void;
  addPaymentRecord: (record: PaymentRecord) => void;
  addRefundRecord: (record: RefundRecord) => void;
  processRefund: (billId: string, refund: RefundRecord) => void;
  
  updateEvaluationResprayStatus: (id: string, status: 'approved' | 'rejected', respray_note?: string) => void;
  
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  
  addOperation: (operation: Operation) => void;
  updateOperation: (operation: Operation) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  farmlands: mockFarmlands,
  appointments: mockAppointments,
  surveys: mockSurveys,
  operationPhotos: mockOperationPhotos,
  bills: mockBills,
  paymentRecords: mockPaymentRecords,
  refundRecords: mockRefundRecords,
  evaluations: mockEvaluations,
  schedules: mockSchedules,
  operations: mockOperations,

  updateFarmlandMeasuredArea: (id, measured_area) =>
    set((state) => ({
      farmlands: state.farmlands.map((f) =>
        f.id === id ? { ...f, measured_area, last_measured_at: new Date().toISOString().replace('T', ' ').slice(0, 19) } : f
      ),
    })),

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),

  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),

  updateAppointmentArea: (id, measured_area) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, measured_area } : a
      ),
    })),

  updateAppointmentSchedule: (appointmentId, scheduleId) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, schedule_id: scheduleId, status: 'scheduled' } : a
      ),
    })),

  updateAppointmentBill: (appointmentId, billId) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, bill_id: billId, status: 'pending_settlement' } : a
      ),
    })),

  updateAppointmentOperation: (appointmentId, operationId) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, operation_id: operationId, status: 'in_progress' } : a
      ),
    })),

  updateAppointmentSurvey: (appointmentId, surveyId) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, survey_id: surveyId, status: 'surveyed' } : a
      ),
    })),

  signAppointment: (id, signed_by) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { 
          ...a, 
          status: 'signed', 
          signed_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
          signed_by 
        } : a
      ),
    })),

  updateSurvey: (survey) =>
    set((state) => ({
      surveys: state.surveys.map((s) =>
        s.id === survey.id ? survey : s
      ),
    })),

  addSurvey: (survey) =>
    set((state) => ({
      surveys: [...state.surveys, survey],
    })),

  addOperationPhoto: (photo) =>
    set((state) => {
      const photos = [...state.operationPhotos, photo];
      const operationId = photo.operation_id;
      const opPhotos = photos.filter(p => p.operation_id === operationId);
      const hasBefore = opPhotos.some(p => p.type === 'before');
      const hasAfter = opPhotos.some(p => p.type === 'after');
      
      if (hasBefore && hasAfter) {
        const operations = state.operations.map(o => {
          if (o.id === operationId && o.status === 'completed') {
            return { ...o };
          }
          return o;
        });
        const appointments = state.appointments.map(a => {
          if (a.operation_id === operationId && (a.status === 'operation_completed' || a.status === 'in_progress')) {
            return { ...a, status: 'photos_uploaded' as const };
          }
          return a;
        });
        return { operationPhotos: photos, operations, appointments };
      }
      
      return { operationPhotos: photos };
    }),

  addBill: (bill) =>
    set((state) => {
      const newBills = [bill, ...state.bills];
      const appointments = state.appointments.map(a => {
        if (a.id === bill.appointment_id) {
          return { ...a, bill_id: bill.id, status: 'pending_settlement' as const };
        }
        return a;
      });
      return { bills: newBills, appointments };
    }),

  updateBillPayment: (id, amount, status) =>
    set((state) => {
      const bills = state.bills.map((b) => {
        if (b.id === id) {
          const remaining = b.total_amount - (b.paid_amount || 0) - (b.refunded_amount || 0);
          const actualAmount = Math.min(amount, Math.max(0, remaining));
          const newPaid = (b.paid_amount || 0) + actualAmount;
          let newStatus: Bill['status'] = status || b.status;
          if (!status) {
            if (newPaid >= b.total_amount - 0.01) {
              newStatus = 'paid';
            } else if (newPaid > 0) {
              newStatus = 'partial';
            }
          }
          return {
            ...b,
            paid_amount: parseFloat(newPaid.toFixed(2)),
            status: newStatus,
            paid_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : b.paid_date,
          };
        }
        return b;
      });
      
      const updatedBill = bills.find(b => b.id === id);
      let appointments = state.appointments;
      if (updatedBill && updatedBill.status === 'paid') {
        appointments = state.appointments.map(a => {
          if (a.bill_id === id) {
            return { ...a, status: 'settled' as const };
          }
          return a;
        });
      }
      
      return { bills, appointments };
    }),

  addPaymentRecord: (record) =>
    set((state) => ({
      paymentRecords: [...state.paymentRecords, record],
    })),

  addRefundRecord: (record) =>
    set((state) => ({
      refundRecords: [...state.refundRecords, record],
    })),

  processRefund: (billId, refund) =>
    set((state) => {
      const newRefundRecords = [...state.refundRecords, refund];
      
      const bills = state.bills.map(b => {
        if (b.id === billId) {
          const newRefunded = (b.refunded_amount || 0) + refund.amount;
          const newPaid = b.paid_amount - refund.amount;
          let newStatus: Bill['status'] = b.status;
          if (newRefunded >= b.total_amount - 0.01) {
            newStatus = 'refunded';
          } else if (newPaid <= 0) {
            newStatus = 'unpaid';
          } else {
            newStatus = 'partial';
          }
          return {
            ...b,
            refunded_amount: parseFloat(newRefunded.toFixed(2)),
            paid_amount: parseFloat(Math.max(0, newPaid).toFixed(2)),
            status: newStatus,
          };
        }
        return b;
      });
      
      const updatedBill = bills.find(b => b.id === billId);
      let appointments = state.appointments;
      if (updatedBill && (updatedBill.status === 'unpaid' || updatedBill.status === 'partial')) {
        appointments = state.appointments.map(a => {
          if (a.bill_id === billId && a.status === 'settled') {
            return { ...a, status: 'pending_settlement' as const };
          }
          return a;
        });
      }
      
      return { refundRecords: newRefundRecords, bills, appointments };
    }),

  updateEvaluationResprayStatus: (id, status, respray_note) =>
    set((state) => ({
      evaluations: state.evaluations.map((e) =>
        e.id === id ? { ...e, respray_status: status, respray_note } : e
      ),
    })),

  addSchedule: (schedule) =>
    set((state) => {
      const newSchedules = [...state.schedules, schedule];
      const appointments = state.appointments.map(a => {
        if (a.id === schedule.appointment_id && !a.schedule_id) {
          return { ...a, schedule_id: schedule.id, status: 'scheduled' as const };
        }
        return a;
      });
      return { schedules: newSchedules, appointments };
    }),

  updateSchedule: (schedule) =>
    set((state) => ({
      schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s),
    })),

  addOperation: (operation) =>
    set((state) => {
      const newOperations = [...state.operations, operation];
      const appointments = state.appointments.map(a => {
        if (a.id === operation.appointment_id && !a.operation_id) {
          return { ...a, operation_id: operation.id, status: 'in_progress' as const };
        }
        return a;
      });
      return { operations: newOperations, appointments };
    }),

  updateOperation: (operation) =>
    set((state) => {
      const operations = state.operations.map(o => o.id === operation.id ? operation : o);
      let appointments = state.appointments;
      if (operation.status === 'completed') {
        appointments = state.appointments.map(a => {
          if (a.operation_id === operation.id && a.status === 'in_progress') {
            return { ...a, status: 'operation_completed' as const };
          }
          return a;
        });
      }
      return { operations, appointments };
    }),
}));
