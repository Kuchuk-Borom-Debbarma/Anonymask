export default interface UserFieldType {
  type: 'int' | 'float' | 'text' | 'enum';
  options: string[];
}
