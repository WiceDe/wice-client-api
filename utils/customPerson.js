function customPerson(person) {
  const customUserFormat = {
    rowid: person.rowid,
    mandant: person.mandant,
    for_rowid: person.for_rowid,
    same_contactperson: person.same_contactperson,
    last_update: person.last_update,
    deactivated: person.deactivated,
    name: person.name,
    firstname: person.firstname,
    email: person.email,
    title: person.title,
    salutation: person.salutation,
    birthday: person.birthday,
    private_street: person.private_street,
    private_street_number: person.private_street_number,
    private_zip_code: person.private_zip_code,
    private_town: person.private_town,
    private_state: person.private_state,
    private_country: person.private_country,
    phone: person.phone,
    fax: person.fax,
    private_phone: person.private_phone,
    private_mobile_phone: person.private_mobile_phone,
    private_email: person.private_email,
  };
  return customUserFormat;
}

module.exports = { customPerson };
