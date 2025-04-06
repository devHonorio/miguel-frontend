const UserPropertiesValues = {
  PHONE_LENGTH: 11,
  LENGTH_FOR_NAME: 2,
} as const;

function phoneValidator(phone: string) {
  return (
    User.removePhoneStr(phone).length === UserPropertiesValues.PHONE_LENGTH
  );
}

function removePhoneStr(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function phoneMask(phone: string) {
  const numbers = removePhoneStr(phone);

  const regex = /^(\d{2})(\d{1})(\d{4})(\d{4})$/;

  const resultado = numbers.replace(regex, "($1) $2 $3-$4");

  return resultado;
}

const User = {
  removePhoneStr,
  phoneValidator,
  phoneMask,
};

export default User;
