const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove, download,
} = require('../controllers/materialController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Lấy danh sách tài liệu
 *     tags: [Học liệu]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Danh sách tài liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Material'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Lấy chi tiết tài liệu
 *     tags: [Học liệu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết tài liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getById);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Tải lên tài liệu mới (Admin/Giảng viên)
 *     tags: [Học liệu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, file]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tải lên thành công
 *       403:
 *         description: Không có quyền
 */
router.post('/', authorize('admin', 'teacher'), upload.single('file'), create);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Cập nhật tài liệu (Admin/Giảng viên)
 *     tags: [Học liệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authorize('admin', 'teacher'), update);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Xóa tài liệu (Admin/Giảng viên)
 *     tags: [Học liệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authorize('admin', 'teacher'), remove);

/**
 * @swagger
 * /api/materials/{id}/download:
 *   get:
 *     summary: Tải file tài liệu
 *     tags: [Học liệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về file nhị phân
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/download', download);

module.exports = router;
