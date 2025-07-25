"use client";

import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

const Statistics = () => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    orderStatusData: [],
    weeklyData: [],
    todayOrders: 0,
    activeClients: 0,
  });

  // Days mapping for backend English keys to French labels
  const days = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
  ];

  // Function to get French day name from English key
  const getFrenchDayName = (englishKey) => {
    const day = days.find((d) => d.key === englishKey.toLowerCase());
    return day ? day.label : englishKey;
  };

  // Simulate API call
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate API response with English day names (as backend would send)
      const apiResponse = {
        orderStatusData: [
          {
            name: "En attente",
            value: Math.floor(Math.random() * 30) + 20,
            color: "#f59e0b",
            icon: Clock,
          },
          {
            name: "En préparation",
            value: Math.floor(Math.random() * 25) + 15,
            color: "#14b8a6",
            icon: Package,
          },
          {
            name: "Prêt à retirer",
            value: Math.floor(Math.random() * 20) + 10,
            color: "#10b981",
            icon: Truck,
          },
          {
            name: "Finalisé",
            value: Math.floor(Math.random() * 50) + 40,
            color: "#6b7280",
            icon: CheckCircle,
          },
        ],
        weeklyData: [
          { day: "monday", orders: Math.floor(Math.random() * 20) + 10 },
          { day: "tuesday", orders: Math.floor(Math.random() * 30) + 15 },
          { day: "wednesday", orders: Math.floor(Math.random() * 25) + 15 },
          { day: "thursday", orders: Math.floor(Math.random() * 35) + 20 },
          { day: "friday", orders: Math.floor(Math.random() * 40) + 25 },
          { day: "saturday", orders: Math.floor(Math.random() * 35) + 20 },
          { day: "sunday", orders: Math.floor(Math.random() * 20) + 8 },
        ],
        todayOrders: Math.floor(Math.random() * 20) + 25,
        activeClients: Math.floor(Math.random() * 50) + 200,
      };

      // Transform the API response to include French day names
      const transformedData = {
        ...apiResponse,
        weeklyData: apiResponse.weeklyData.map((item) => ({
          ...item,
          dayKey: item.day, // Keep original English key if needed
          day: getFrenchDayName(item.day), // Convert to French label
        })),
      };

      // Simulate occasional API errors
      if (Math.random() < 0.1) {
        throw new Error("Erreur de connexion au serveur");
      }

      setData(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalOrders = data.orderStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const maxWeeklyOrders = Math.max(...data.weeklyData.map((d) => d.orders));

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  // Error Component
  const ErrorMessage = ({ onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Réessayer
      </button>
    </div>
  );

  // Enhanced Pie Chart Component
  const EnhancedPieChart = ({ data: chartData }) => {
    if (!chartData || chartData.length === 0) return null;

    let cumulativeAngle = 0;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    const segments = chartData.map((item, index) => {
      const percentage = (item.value / totalOrders) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      const labelAngle = (startAngle + endAngle) / 2;
      const labelAngleRad = (labelAngle * Math.PI) / 180;
      const labelRadius = radius + 30;
      const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
      const labelY = centerY + labelRadius * Math.sin(labelAngleRad);

      cumulativeAngle += angle;

      return {
        ...item,
        pathData,
        percentage: percentage.toFixed(1),
        labelX,
        labelY,
        index,
      };
    });

    return (
      <div className="relative w-80 h-80 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 300 300">
          <defs>
            <filter
              id="dropshadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="2" result="offset" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="3"
                filter="url(#dropshadow)"
                className="transition-all duration-300 cursor-pointer"
                style={{
                  transform:
                    hoveredSegment === index ? "scale(1.05)" : "scale(1)",
                  transformOrigin: `${centerX}px ${centerY}px`,
                  opacity:
                    hoveredSegment !== null && hoveredSegment !== index
                      ? 0.6
                      : 1,
                }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            </g>
          ))}

          <circle
            cx={centerX}
            cy={centerY}
            r="40"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="2"
            filter="url(#dropshadow)"
          />

          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            className="text-2xl font-bold"
            fill="#1f2937"
          >
            {totalOrders}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="text-sm"
            fill="#6b7280"
          >
            Total
          </text>
        </svg>

        {hoveredSegment !== null && (
          <div
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: segments[hoveredSegment].labelX,
              top: segments[hoveredSegment].labelY - 10,
            }}
          >
            <div className="text-sm font-medium">
              {segments[hoveredSegment].name}
            </div>
            <div className="text-xs text-gray-300">
              {segments[hoveredSegment].value} commandes (
              {segments[hoveredSegment].percentage}%)
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Bar Chart Component
  const EnhancedBarChart = ({ data: chartData }) => {
    if (!chartData || chartData.length === 0) return null;

    return (
      <div className="flex items-end justify-between h-64 px-4">
        {chartData.map((item, index) => {
          const height = (item.orders / maxWeeklyOrders) * 200;
          const isHovered = hoveredBar === index;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-3 flex-1"
            >
              <div className="relative w-full max-w-12">
                <div
                  className="w-full rounded-t-lg transition-all duration-300 cursor-pointer shadow-lg"
                  style={{
                    height: `${height}px`,
                    background: isHovered
                      ? "linear-gradient(to top, #0d9488, #14b8a6)"
                      : "linear-gradient(to top, #14b8a6, #5eead4)",
                    transform: isHovered ? "scaleY(1.05)" : "scaleY(1)",
                    transformOrigin: "bottom",
                  }}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                ></div>

                {isHovered && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg">
                    {item.orders}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorMessage onRetry={fetchData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? // Loading skeletons for cards
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg border-l-4 border-l-gray-300 p-6"
                >
                  <LoadingSkeleton />
                </div>
              ))
            : data.orderStatusData.map((status, index) => {
                const IconComponent = status.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 p-6"
                    style={{ borderLeftColor: status.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {status.name}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {status.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {((status.value / totalOrders) * 100).toFixed(1)}% du
                          total
                        </p>
                      </div>
                      <div className="p-4 rounded-full bg-gray-50">
                        <IconComponent
                          className="h-8 w-8"
                          style={{ color: status.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-teal-50 border-b p-4 rounded-t-lg">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-teal-800">
                <BarChart3 className="h-5 w-5" />
                Répartition des Statuts
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              ) : (
                <EnhancedPieChart data={data.orderStatusData} />
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-teal-50 border-b p-4 rounded-t-lg">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-teal-800">
                <TrendingUp className="h-5 w-5" />
                Commandes Hebdomadaires
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              ) : (
                <>
                  <EnhancedBarChart data={data.weeklyData} />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Nombre de commandes par jour
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-l-teal-500 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Commandes Aujourd'hui
                </p>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.todayOrders}
                    </p>
                    <p className="text-xs text-teal-600 font-medium">
                      +12% vs hier
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-l-4 border-l-green-500 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Clients Actifs
                </p>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.activeClients}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      +5% cette semaine
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border-l-4 border-l-amber-500 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Commandes
                </p>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalOrders}
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                      Toutes statuts
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
