import { create } from 'zustand';
import type {
  Appointment,
  Survey,
  OperationPhoto,
  Bill,
  Evaluation,
  Schedule,
  Operation,
} from '@/data/types';
import {
  mockAppointments,
  mockSurveys,
  mockOperationPhotos,
  mockBills,
  mockEvaluations,
  mockSchedules,
  mockOperations,
} from '@/data/mockData';

interface AppState {
  appointments: Appointment[];
  surveys: Survey[];
  operationPhotos: OperationPhoto[];
  bills: Bill[];
  evaluations: Evaluation[];
  schedules: Schedule[];
  operations: Operation[];
  
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  
  updateSurvey: (survey: Survey) => void;
  
  addOperationPhoto: (photo: OperationPhoto) => void;
  
  addBill: (bill: Bill) => void;
  updateBillPayment: (id: string, amount: number, status?: Bill['status']) => void;
  
  updateEvaluationResprayStatus: (id: string, status: 'approved' | 'rejected', respray_note?: string) => void;
  
  addSchedule: (schedule: Schedule) => void;
}

export const useAppStore = create<AppState>((set) => ({
  appointments: mockAppointments,
  surveys: mockSurveys,
  operationPhotos: mockOperationPhotos,
  bills: mockBills,
  evaluations: mockEvaluations,
  schedules: mockSchedules,
  operations: mockOperations,

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
          const newPaid = b.paid_amount + amount;
          let newStatus: Bill['status'] = status || b.status;
          if (!status) {
            if (newPaid >= b.total_amount) {
              newStatus = 'paid';
            } else if (newPaid > 0) {
              newStatus = 'partial';
            }
          }
          return {
            ...b,
            paid_amount: newPaid,
            status: newStatus,
            paid_date: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : b.paid_date,
          };
        }
        return b;
      }),
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
