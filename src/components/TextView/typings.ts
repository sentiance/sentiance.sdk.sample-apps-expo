// typings for Text View Component
export interface TextViewProps {
  title: string;
  status:
    | 'ALWAYS'
    | 'UNAVAILABLE'
    | 'DENIED'
    | 'WHILE IN USE'
    | 'NEVER'
    | 'BLOCKED'
    | undefined
    | string;
  type: 'LOCATION' | 'MOTION';
}
