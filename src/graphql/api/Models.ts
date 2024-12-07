export interface ResponseModel<T> {
  data?:T
  msg?:string
}

export interface StringResponseModel extends ResponseModel<string>{}
