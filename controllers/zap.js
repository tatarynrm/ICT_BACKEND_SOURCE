const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const pool = require("../db/pool");

const getAllZap = async (req, res) => {
  const { KOD_OS } = req.body;
  console.log("-------------------", KOD_OS);
  try {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";
    const result = await connection.execute(
      `SELECT a.*,
              b.pip,
              p_zap.CountComm(a.kod) as countcomm,
              p_zap.CountNewComm(${KOD_OS}, a.kod) as countnewcomm,
              p_zap.IsNewZap(${KOD_OS}, a.kod) as isnew
       FROM zap a
       JOIN OS b on a.kod_os = b.kod
       WHERE a.status = 0`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("1---", error);
  }
};
const getDownloadById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `select * from ictdat.AAAA_ZAGRYZKY where ID = ${id}`
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

const getGroups = async (req, res) => {
  const { NGROUP, KOD, DATCLOSE, KOD_AUTHOR, kod } = req.body;

  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(`select a.*, 
                                            p_zap.CountNewZap(${kod} ,a.kod) as countnewzap 
                                            from ictdat.zapgroup a`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};
const createZap = async (req, res) => {
  const { pKodAuthor, pKodGroup, pZav, pRozv, pZapText } = req.body;

  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `BEGIN
            ICTDAT.p_zap.AddZap(:pKodAuthor, :pKodGroup, :pZav,:pRozv,
                :pZapText,:pKodZap);
        END;`,
      {
        pKodAuthor,
        pKodGroup,
        pZav,
        pRozv,
        pZapText,
        pKodZap: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Змінюємо статус заявки
const deleteZap = async (req, res) => {
  const { pKodAuthor, pKodZap, pStatus } = req.body;

  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `BEGIN
            ICTDAT.p_zap.SetStatusZap(:pKodAuthor,:pKodZap,:pStatus);
        END;`,
      {
        pKodAuthor,
        pStatus,
        pKodZap,
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createZap,
  getAllZap,
  getGroups,
  deleteZap,
};
