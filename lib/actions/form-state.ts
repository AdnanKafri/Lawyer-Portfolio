export type FormActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const defaultFormActionState: FormActionState = {
  status: "idle",
  message: "",
};
