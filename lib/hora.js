function hora() {
    let horaAtual = new Date();
    let minutos = horaAtual.getMinutes();

    if (minutos < 10) minutos = '0'+minutos;

    return horaAtual.getHours() + ':' + minutos;
}