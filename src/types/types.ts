export interface UserTypes {
  id?: string;                   
  name?: string;                 
  email?: string;               
  password?: string;            
  photoURL?: string;             
  createdAt?: Date;              
  writes?: string[];             
  writesCount?: number;          
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };                             
}
