export type Dataset = {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
  tension?: number;
};

export type GraphicData = {
  labels: string[];
  datasets: Dataset[];
};

export type Graphic = {
  type: string;
  data: GraphicData;
};

export type GraphicResponse = {
  count: number;
  graphics: Graphic[];
  page: string;
  ok: boolean;
};

export type GraphicAddResponse = {
  graphic: Graphic;
  ok: boolean;
};
