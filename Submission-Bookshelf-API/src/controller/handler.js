const { nanoid } = require("nanoid");
const { books } = require("../model/book");
const { id } = require("@hapi/joi/lib/base");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage,  reading } =
        request.payload;

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message:
                "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
    console.log("finished : " + finished);

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
        insertedAt,
        updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((b) => b.id === id).length > 0;
    if (isSuccess) {
        return h
            .response({
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId: id,
                },
            })
            .code(201);
    } else {
        return h
            .response({
                status: "error",
                message: "Buku gagal ditambahkan karena kesalahan server",
            })
            .code(500);
    }
};

const getAllBooksHandler = () => {
    const displayBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));
    return {
        status: "success",
        data: {
            books: displayBooks,
        },
    };
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((book) => book.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: "success",
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished: pageCount === readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return h
            .response({
                status: "success",
                message: "Buku berhasil dihapus",
            })
            .code(200);
    }

    return h
        .response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        })
        .code(404);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
