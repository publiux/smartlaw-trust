
function isException(error) {
    let strError = error.toString();
    return strError.includes('VM Exception') || strError.includes('invalid opcode') || strError.includes('invalid JUMP');
}

function ensureException(error) {
    assert(isException(error), error.toString());
}

module.exports = {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    isException: isException,
    ensureException: ensureException,
    SECONDS_PER_DAY: 86400
};
