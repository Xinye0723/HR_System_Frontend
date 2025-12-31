import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. 複製 (Clone) 請求，並加上 withCredentials: true
  // 因為 HTTP Request 是不可變的 (Immutable)，所以必須用 clone 來產生新的
  const newReq = req.clone({
    withCredentials: true
  });

  // 2. 把新的請求送出去
  return next(newReq);
};