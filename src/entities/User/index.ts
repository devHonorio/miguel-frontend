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

function haveNameAndLastName(fullname: string) {
  return fullname.includes(" ");
}

function validationLengthName(fullname: string) {
  const splitName = fullname.split(" ");

  const shortName = splitName.filter(
    (name) => name.length < UserPropertiesValues.LENGTH_FOR_NAME,
  );

  return shortName.length === 0;
}

function removeUnwantedCharactersOfName(fullname: string) {
  return fullname.replace(/[^a-zA-Z\sçãẽĩõũâêîôûéóáíú]/g, "").trim();
}

const User = {
  removePhoneStr,
  phoneValidator,
  phoneMask,
  haveNameAndLastName,
  validationLengthName,
  removeUnwantedCharactersOfName,
};

export default User;
