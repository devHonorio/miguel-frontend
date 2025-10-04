import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const useStates = () => {
  const [addressStates, setAddressStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
    modalUpdate: parseAsBoolean.withDefault(false),
    modalAlertDelete: parseAsBoolean.withDefault(false),

    idUpdate: parseAsString.withDefault(""),
    idDelete: parseAsString.withDefault(""),

    take: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(0),
    query: parseAsString.withDefault(""),
  });

  return {
    ...addressStates,
    setAddressStates,
  };
};
