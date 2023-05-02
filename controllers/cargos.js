const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const pool = require("../db/index");
const { GET_ALL_CARGOS } = require("../queries/cargos");

const getAllCargos = async (req, res) => {
  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(GET_ALL_CARGOS);

    res.status(200).json(result.rows.length);
  } catch (error) {
    console.log(error);
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(pool);
    const result = await connection.execute(
      `select * from ictdat.os where kod = ${id}`
    );
    console.log(result.rows);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllCargos,
  getUserById,
};
