const middleware = (req, res, next) => {
    const mensagem = req.flash('mensagem');
    const erro = req.flash('erro');

    res.locals.mensagem = mensagem.length > 0 ? mensagem[0] : undefined;
    res.locals.erro = erro.length > 0 ? erro[0] : undefined;

    next();
};

module.exports = middleware