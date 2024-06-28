from pydantic import BaseModel
from typing import Any, Dict, List

class IndicatorData(BaseModel):
    date: str
    value: float

class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]

class GdpStockCorrelationData(BaseModel):
    quarter: str
    gdp_growth_rate: float
    avg_stock_return: float

class Financials(BaseModel):
    ticker: str
    companyName: str
    industry: str
    sector: str
    marketCap: float
    totalRevenue: float
    netIncome: float

class StockData(BaseModel):
    ticker: str
    chartData: ChartData
    financials: Financials
    offExchangeTrading: Dict[str, Any]
    insiderTrading: Dict[str, Any]
    senateTrading: List[Dict[str, Any]]

class EconomicIndicatorSeries(BaseModel):
    gdp: List[IndicatorData]
    cpi: List[IndicatorData]
    unemployment_rate: List[IndicatorData]
    avg_hourly_earnings: List[IndicatorData] = []
    avg_weekly_earnings: List[IndicatorData] = []
    employment_cost_index: List[IndicatorData] = []
    job_openings: List[IndicatorData] = []
    nonfarm_payrolls: List[IndicatorData] = []
    total_wages_and_salaries: List[IndicatorData] = []

class BailoutStimulusChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, str]]

class BailoutStimulusData(BaseModel):
    chartData: BailoutStimulusChartData

class TickerPrice(BaseModel):
    symbol: str
    price: float

class UnemploymentConsumerSpendingData(BaseModel):
    date: str
    unemployment_rate: float
    consumer_spending: float

class StockSectorData(BaseModel):
    date: str
    sector: str
    stock_price: float

class InflationStockImpactData(BaseModel):
    date: str
    inflation_rate: float
    stock_data: List[StockSectorData]

class SectorGrowthData(BaseModel):
    date: str
    sector: str
    growth_percentage: float

class JobsAnalysis(BaseModel):
    date: str
    labor_force_participation_rate: float
    discouraged_workers: int
    marginally_attached_workers: int
    underemployment_rate: float
