const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const pool = require("../db/pool");

const getCommentsById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      //   `SELECT * FROM ICTDAT.ZAPCOMM  where KOD_ZAP = ${id}`
      `SELECT a.*,b.PIP FROM ICTDAT.ZAPCOMM a join ictdat.os b on a.kod_os = b.kod where KOD_ZAP = ${id}`
      //   `SELECT a.*, b.pip FROM ICTDAT.ZAP a join ictdat.os b on a.kod_os = b.kod`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
const getDownloadById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `select * from ictdat.AAAA_ZAGRYZKY where ID = ${id}`
    );
    console.log(result.rows);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

const getGroups = async (req, res) => {
  const { NGROUP, KOD, DATCLOSE, KOD_AUTHOR } = req.body;

  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(`select * from ictdat.zapgroup`);
    console.log(result);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
const addZapComment = async (req, res) => {
  const { pKodAuthor, pKodZap, pComment } = req.body;

  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `BEGIN
            ICTDAT.p_zap.AddComm(:pKodAuthor, :pKodZap, :pComment,:pKodCom);
        END;`,
      {
        // bind variables
        // id: 159,
        // name: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
        // salary: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        pKodAuthor,
        pKodZap,
        pComment,
        pKodCom: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        // pKodZap: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },000
      }
    );
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const setNewCommentsCount = async (req, res) => {
  const { comment } = req.body;
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCommentsById,
  addZapComment,
};
