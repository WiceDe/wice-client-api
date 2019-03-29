function customOrganization(organization) {
  const customOrganizationFormat = {
    rowid: organization.rowid,
    last_update: organization.last_update,
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    fax: organization.fax,
    street: organization.street,
    street_number: organization.street_number,
    zip_code: organization.zip_code,
    p_o_box: organization.p_o_box,
    town: organization.town,
    state: organization.state,
    country: organization.country,

  };
  return customOrganizationFormat;
}

module.exports = { customOrganization };
