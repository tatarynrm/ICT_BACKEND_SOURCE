const GET_ALL_USERS = `SELECT * FROM ICTDAT.OS`;
const GET_AUTH_DETAILS = (email, password) => {
  return `SELECT
a.KOD,
a.PRIZV,
a.IMJA,
a.PIPFULL,
b.DB_PASSWD,
c.MAIL
FROM
ictdat.os a
JOIN ictdat.us b ON
a.kod = b.kod_os
JOIN ICTDAT.OSMAIL c ON a.kod = c.KOD_OS 
WHERE
a.ZVILDAT IS NULL 
AND c.mail = ${email}
AND b.DB_PASSWD = ${password}
ORDER BY
a.pip ASC`;
};
module.exports = {
  GET_ALL_USERS,
  GET_AUTH_DETAILS,
};
