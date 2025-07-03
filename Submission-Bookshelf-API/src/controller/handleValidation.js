const Joi = require('@hapi/joi');
const handleValidation = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Gagal memperbarui buku. Mohon isi nama buku', 
        'string.empty': 'Gagal memperbarui buku. Mohon isi nama buku',
    }),
    year: Joi.number().integer().required().messages({
        'any.required': 'Gagal menambahkan buku. Mohon isi tahun buku',
        'number.base': 'Gagal menambahkan buku. Tahun harus berupa angka',
        'number.integer': 'Gagal menambahkan buku. Tahun harus berupa bilangan bulat',
    }),
    author: Joi.string().optional().messages({
        'string.empty': 'Gagal memperbarui buku. Mohon isi nama penulis',
    }),
    summary: Joi.string().allow(''), 
    publisher: Joi.string().allow(''),
    pageCount: Joi.number().integer().min(1).required().messages({
        'any.required': 'Gagal menambahkan buku. Mohon isi jumlah halaman',
        'number.base': 'Gagal menambahkan buku. pageCount harus berupa angka',
        'number.integer': 'Gagal menambahkan buku. pageCount harus berupa bilangan bulat',
        'number.min': 'Gagal menambahkan buku. pageCount harus lebih dari 0',
    }),
    readPage: Joi.number().integer().min(0).required().messages({
        'any.required': 'Gagal menambahkan buku. Mohon isi halaman yang sudah dibaca',
        'number.base': 'Gagal menambahkan buku. readPage harus berupa angka',
        'number.integer': 'Gagal menambahkan buku. readPage harus berupa bilangan bulat',
        'number.min': 'Gagal menambahkan buku. readPage tidak boleh negatif',
    }),
    
    reading: Joi.boolean().default(false),  
});

module.exports = {handleValidation};