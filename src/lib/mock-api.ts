// src/lib/mock-api.ts

// Типы для нашего ответа API, чтобы TypeScript был доволен
type Kpi = {
    totalUsers: number;
    totalPlaces: number;
    totalCiders: number;
    totalReviews: {
      ciders: number;
      places: number;
      total: number;
    };
}

type UserDemographics = {
    byCountry: { country: string; count: number }[];
    byGender: { gender: string; count: number }[];
    byAge: { range: string; count: number }[];
}

export type DashboardStats = {
  kpi: Kpi;
  userDemographics: UserDemographics;
}


// Эта функция имитирует задержку сети и возвращает данные
export const mockDashboardApi = async (): Promise<DashboardStats> => {
  console.log("Fetching mock dashboard data...");
  
  // Имитация задержки сети в 1 секунду
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockData: DashboardStats = {
    kpi: {
      totalUsers: 1357,
      totalPlaces: 342,
      totalCiders: 891,
      totalReviews: {
        ciders: 4567,
        places: 1234,
        total: 5801
      }
    },
    userDemographics: {
      byCountry: [
        { country: "Россия", count: 812 },
        { country: "Беларусь", count: 251 },
        { country: "Казахстан", count: 148 },
        { country: "Другие", count: 146 }
      ],
      byGender: [
        { gender: "male", count: 650 },
        { gender: "female", count: 457 },
        { gender: "not_specified", count: 250 }
      ],
      byAge: [
        { range: "18-24", count: 310 },
        { range: "25-34", count: 580 },
        { range: "35-44", count: 287 },
        { range: "45+", count: 180 }
      ]
    }
  };

  console.log("Mock data ready:", mockData);
  return mockData;
};