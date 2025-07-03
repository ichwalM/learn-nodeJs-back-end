const { nanoid } = require('nanoid');
const { books } = require('../model/book');
const { id } = require('@hapi/joi/lib/base');



const addBookHandler = (request, h) =>{
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage,
    } = request.payload;

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const insertedAt = createdAt;
    const finished = (pageCount === readPage);
    const reading = (readPage > 0 && readPage < pageCount);

    const newBook = {
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage,
        finished, 
        reading,  
        createdAt,
        insertedAt
    }
    books.push(newBook);

    const isSuccess = books.filter((b) => b.id === id).length > 0;
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        }).code(201);
    } else {
        return h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan'
        }).code(500);
    }
}
const getAllBooksHandler = () => {
    const displayBooks = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher, 
    }));
    return {
        status: 'success',
        data: {
            books: displayBooks
        },
    };
};
const getBookByIdHandler = (request, h) => {
    
    const { bookId } = request.params; 
    const book = books.find((b) => b.id === bookId);
    
    if (book !== undefined) { 
        return h.response({
            status: 'success',
            message: 'Buku ditemukan', 
            data: {
                book: book, 
            },
        }).code(200); 
    }
    
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404); 
};

const editBookByIdHandler = (request, h) => {
    
    const { bookId } = request.params;

    const { 
        name, year, author, summary, publisher,
        pageCount, readPage, reading 
    } = request.payload;

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) { 
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404); 
    }

    const currentBook = books[index];
    const updatedPageCount = pageCount !== undefined ? pageCount : currentBook.pageCount;
    const updatedReadPage = readPage !== undefined ? readPage : currentBook.readPage;

    if (updatedReadPage > updatedPageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400); 
    }

    const insertedAt = new Date().toISOString(); 
    const finished = (updatedPageCount === updatedReadPage); 

    const updatedBook = {
        ...currentBook, 
        name,           
        year,
        author,
        summary,
        publisher,
        pageCount: updatedPageCount, 
        readPage: updatedReadPage,   
        finished,                    
        reading: reading !== undefined ? reading : currentBook.reading, 
        insertedAt,
    };

    books[index] = updatedBook; 
    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200); 
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    
    if (index !== -1) { 
        books.splice(index, 1); 
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200); 
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404); 
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};