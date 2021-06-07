export interface CoefficientWem {
  id: number;
  coefficient: number;
}

export interface Container {
  coefficients: CoefficientWem[];
}

export interface CoefficientResponse {
  errorCode: string;
  errorMessage: string;
  container: Container;
}
