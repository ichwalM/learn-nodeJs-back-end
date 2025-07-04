const { path } = require('@hapi/joi/lib/errors');
const {
    handleValidationPost,
    handleValidationPut
} = require('../controller/handleValidation');
const {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
} = require('../controller/handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
        options: { 
            validate: {
                payload: handleValidationPost, 
                failAction: (request, h, err) => {
                    const errorMessage = err.details ? err.details[0].message : 'Payload tidak valid';
                    return h.response({
                        status: 'fail',
                        message: errorMessage, 
                    }).code(400).takeover(); 
                },
            },
        },
    },{
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },{
        method: 'GET',
        path: '/books/{bookId}',
        handler : getBookByIdHandler,
    },{
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler,
    },{
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
    }
];
module.exports = routes;