var getCor = (nomeUsuario) => {
    const COR = [
        '#6A5ACD', '#32CD32', '#FF69B4', '#BA55D3',
        '#4682B4', '#00CED1', '#006400', '#FF8C00',
        '#556B2F', '#FF0000', '#808000', '#A0522D',
        '#8B4513', '#BC8F8F', '#D2691E', '#DEB887',
        '#D2B48C', '#7B68EE', '#4B0082', '#9400D3',
        '#FFD700', '#A020F0', '#FF00FF', '#EE82EE',
        '#DA70D6', '#B8860B', '#C71585', '#CD5C5C',
        '#B22222', '#FF6347', '#800000', '#FFA500',
        '#B0E0E6', '#1C1C1C', '#000080', '#0000CD'
    ]
    
    let randomico = Math.round( Math.random() * (COR.length+1) );
    let indice = 0;
    for( let i=0; i<nomeUsuario.length; i++) {
        randomico = nomeUsuario.charCodeAt(i) + 
                            (randomico << 2) - 
                            randomico;
        indice = Math.abs( randomico % COR.length );
    }
    return COR[ indice ];
}

module.exports = getCor;