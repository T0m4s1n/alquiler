"use client"

import { useEffect, useRef } from "react"
import type { MonthlyIncomeByType } from "../types/rental"
import Chart from "chart.js/auto"

type IncomeChartProps = {
  data: MonthlyIncomeByType[]
}

export default function IncomeChart({ data }: IncomeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!data.length || !chartRef.current) return

    // Destruir el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Procesar los datos para el gráfico
    const months = Array.from(new Set(data.map((item) => `${item.anio}-${item.mes}`))).sort((a, b) =>
      a.localeCompare(b),
    )

    const vehicleTypes = Array.from(new Set(data.map((item) => item.tipoVehiculo)))

    // Crear datasets para cada tipo de vehículo
    const datasets = vehicleTypes.map((type) => {
      // Asignar un color según el tipo de vehículo
      const color = getColorForVehicleType(type)

      return {
        label: type,
        data: months.map((month) => {
          const [year, monthNum] = month.split("-").map(Number)
          const item = data.find((d) => d.anio === year && d.mes === monthNum && d.tipoVehiculo === type)
          return item ? item.ingresoTotal : 0
        }),
        backgroundColor: color.background,
        borderColor: color.border,
        borderWidth: 2,
        tension: 0.3,
      }
    })

    // Formatear los nombres de los meses para las etiquetas
    const labels = months.map((month) => {
      const [year, monthNum] = month.split("-").map(Number)
      return new Date(year, monthNum - 1).toLocaleDateString("es-ES", { month: "short", year: "numeric" })
    })

    // Crear el gráfico
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Ingresos mensuales por tipo de vehículo",
              font: {
                size: 16,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  let label = context.dataset.label || ""
                  if (label) {
                    label += ": "
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(
                      context.parsed.y,
                    )
                  }
                  return label
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "$" + value,
              },
              title: {
                display: true,
                text: "Ingresos ($)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Mes",
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  // Función para asignar colores según el tipo de vehículo
  const getColorForVehicleType = (type: string) => {
    switch (type) {
      case "SEDAN":
        return { background: "rgba(59, 130, 246, 0.2)", border: "rgb(59, 130, 246)" } // blue
      case "SUV":
        return { background: "rgba(16, 185, 129, 0.2)", border: "rgb(16, 185, 129)" } // green
      case "HATCHBACK":
        return { background: "rgba(139, 92, 246, 0.2)", border: "rgb(139, 92, 246)" } // purple
      case "PICKUP":
        return { background: "rgba(249, 115, 22, 0.2)", border: "rgb(249, 115, 22)" } // orange
      case "DEPORTIVO":
        return { background: "rgba(239, 68, 68, 0.2)", border: "rgb(239, 68, 68)" } // red
      case "MINIVAN":
        return { background: "rgba(234, 179, 8, 0.2)", border: "rgb(234, 179, 8)" } // yellow
      default:
        return { background: "rgba(107, 114, 128, 0.2)", border: "rgb(107, 114, 128)" } // gray
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <canvas ref={chartRef} />
    </div>
  )
}
