// Extreact object type from array
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
