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

interface AppState {
  farmlands: Farmland[];
  appointments: Appointment[];
  surveys: Survey[];
  operationPhotos: OperationPhoto[];
  bills: Bill[];
  paymentRecords: PaymentRecord[];
  evaluations: Evaluation[];
  schedules: Schedule[];
  operations: Operation[];
  
  updateFarmlandArea: (id: string, area_mu: number) => void;
  
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointmentArea: (id: string, area_mu: number) => void;
  
  updateSurvey: (survey: Survey) => void;
  
  addOperationPhoto: (photo: OperationPhoto) => void;
  
  addBill: (bill: Bill) => void;
  updateBillPayment: (id: string, amount: number, status?: Bill['status']) => void;
  addPaymentRecord: (record: PaymentRecord) => void;
  
  updateEvaluationResprayStatus: (id: string, status: 'approved' | 'rejected', respray_note?: string) => void;
  
  addSchedule: (schedule: Schedule) => void;
}

export const useAppStore = create<AppState>((set) => ({
  farmlands: mockFarmlands,
  appointments: mockAppointments,
  surveys: mockSurveys,
  operationPhotos: mockOperationPhotos,
  bills: mockBills,
  paymentRecords: mockPaymentRecords,
  evaluations: mockEvaluations,
  schedules: mockSchedules,
  operations: mockOperations,

  updateFarmlandArea: (id, area_mu) =>
    set((state) => ({
      farmlands: state.farmlands.map((f) =>
        f.id === id ? { ...f, area_mu } : f
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

  updateAppointmentArea: (id, area_mu) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, area_mu } : a
      ),
    })),

  updateSurvey: (survey) =>
    set((state) => ({
      surveys: state.surveys.map((s) =>
        s.id === survey.id ? survey : s
      ),
    })),

  addOperationPhoto: (photo) =>
    set((state) => ({
      operationPhotos: [...state.operationPhotos, photo],
    })),

  addBill: (bill) =>
    set((state) => ({
      bills: [bill, ...state.bills],
    })),

  updateBillPayment: (id, amount, status) =>
    set((state) => ({
      bills: state.bills.map((b) => {
        if (b.id === id) {
          const remaining = b.total_amount - b.paid_amount;
          const actualAmount = Math.min(amount, remaining);
          const newPaid = b.paid_amount + actualAmount;
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
      }),
    })),

  addPaymentRecord: (record) =>
    set((state) => ({
      paymentRecords: [...state.paymentRecords, record],
    })),

  updateEvaluationResprayStatus: (id, status, respray_note) =>
    set((state) => ({
      evaluations: state.evaluations.map((e) =>
        e.id === id ? { ...e, respray_status: status, respray_note } : e
      ),
    })),

  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule],
    })),
}));
