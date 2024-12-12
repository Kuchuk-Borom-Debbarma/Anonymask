export class StalkDTO {
  stalker: string;
  stalked: string;
  at: Date;
}

export class StalkCounterDTO {
  userId: string;
  stalkerCount: number;
  stalkingCount: number;
}
