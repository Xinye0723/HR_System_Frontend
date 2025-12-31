export interface Employee {
  // 務必改成小寫開頭 (camelCase) 以配合後端 JSON
  employeeId: string;
  name: string;
  englishName: string;
  account: string;
  joinDate: string; // 後端傳來的是字串日期
  status: boolean;
  contactInfo: string;
  role: string;
}