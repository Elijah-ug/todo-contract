const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TaskContractModule", (m) => {
    const contract = m.contract("TaskContract");
    return {contract}
})
