"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import type { Rental, CalendarEvent } from "../types/rental"

moment.locale("es")
const localizer = momentLocalizer(moment)

type RentalCalendarProps = {
  rentals: Rental[]
  onEventClick: (rental: Rental) => void
}

export default function RentalCalendar({ rentals, onEventClick }: RentalCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    // Convertir alquileres a eventos del calendario
    const calendarEvents = rentals.map((rental) => {
      // Determinar el color según el estado
      let color = ""
      switch (rental.estado) {
        case "PENDIENTE":
          color = "#3B82F6" // blue-500
          break
        case "ACTIVO":
          color = "#10B981" // green-500
          break
        case "COMPLETADO":
          color = "#6B7280" // gray-500
          break
        case "CANCELADO":
          color = "#EF4444" // red-500
          break
      }

      return {
        id: rental.id,
        title: `${rental.detalleVehiculo}`,
        start: new Date(rental.fechaInicio),
        end: new Date(rental.fechaFin),
        status: rental.estado,
        clientName: rental.nombreCliente,
        vehicleDetails: rental.detalleVehiculo,
        color: color,
      }
    })

    setEvents(calendarEvents)
  }, [rentals])

  // Personalizar el estilo de los eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0",
        display: "block",
        fontWeight: "500",
      },
    }
  }

  // Personalizar el formato del título del evento
  const formats = {
    eventTimeRangeFormat: () => {
      return ""
    },
  }

  // Componente personalizado para el evento
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="p-1 overflow-hidden h-full">
      <div className="text-xs font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-90 truncate">{event.clientName}</div>
    </div>
  )

  return (
    <div className="h-[600px] bg-white rounded-xl shadow-md p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        eventPropGetter={eventStyleGetter}
        formats={formats}
        components={{
          event: EventComponent,
        }}
        onSelectEvent={(event) => {
          const rental = rentals.find((r) => r.id === event.id)
          if (rental) {
            onEventClick(rental)
          }
        }}
        views={["month", "week", "day", "agenda"]}
        messages={{
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay alquileres en este rango de fechas",
        }}
        className="rental-calendar"
      />

      <style jsx global>{`
        .rental-calendar .rbc-toolbar {
          margin-bottom: 20px;
        }

        .rental-calendar .rbc-toolbar button {
          color: #333;
          border: 1px solid #e5e7eb;
          background-color: white;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .rental-calendar .rbc-toolbar button:hover {
          background-color: #f3f4f6;
        }

        .rental-calendar .rbc-toolbar button.rbc-active {
          background-color: #333;
          color: white;
        }

        .rental-calendar .rbc-header {
          padding: 10px 0;
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: #4b5563;
        }

        .rental-calendar .rbc-today {
          background-color: #f9fafb;
        }

        .rental-calendar .rbc-event {
          padding: 2px;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .rental-calendar .rbc-day-slot .rbc-event {
          border: none;
        }

        .rental-calendar .rbc-month-view, 
        .rental-calendar .rbc-time-view {
          border-radius: 0.5rem;
          border-color: #e5e7eb;
        }

        .rental-calendar .rbc-month-row, 
        .rental-calendar .rbc-time-header, 
        .rental-calendar .rbc-time-content {
          border-color: #e5e7eb;
        }

        .rental-calendar .rbc-off-range-bg {
          background-color: #f9fafb;
        }

        .rental-calendar .rbc-date-cell {
          padding: 4px 5px 0;
          text-align: center;
          font-size: 0.875rem;
        }

        .rental-calendar .rbc-button-link {
          color: #4b5563;
        }

        .rental-calendar .rbc-show-more {
          color: #3B82F6;
          font-weight: 500;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}
