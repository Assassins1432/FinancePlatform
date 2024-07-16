exports.RenderizarInformeView = async (req, res) => {
    try {
        // Lógica para obtener el informe de contabilidad
        // Puedes agregar más lógica aquí si es necesario
        res.render('informe');
    } catch (error) {
        res.status(500).send(error);
    }
};
