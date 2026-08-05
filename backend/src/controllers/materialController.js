const path = require('path');
const { Material, Category, User, Download } = require('../models');

// @desc    Get all materials
// @route   GET /api/materials
const getAll = async (req, res, next) => {
  try {
    const { category_id, status, search, page = 1, limit = 12 } = req.query;
    const where = {};

    if (category_id) where.category_id = category_id;
    if (status) where.status = status;

    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Material.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'full_name', 'email'] },
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      materials: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get material by ID
// @route   GET /api/materials/:id
const getById = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'full_name', 'email'] },
      ],
    });

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy học liệu' });
    }

    res.json({ material });
  } catch (error) {
    next(error);
  }
};

// @desc    Create material
// @route   POST /api/materials
const create = async (req, res, next) => {
  try {
    const { title, description, category_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Vui lòng chọn file để tải lên' });
    }

    const material = await Material.create({
      title,
      description,
      file_url: `/uploads/${file.filename}`,
      file_type: path.extname(file.originalname).slice(1),
      file_size: file.size,
      category_id: category_id || null,
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'Tải lên thành công', material });
  } catch (error) {
    next(error);
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
const update = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy học liệu' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && material.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa' });
    }

    const { title, description, category_id, status } = req.body;
    await material.update({ title, description, category_id, status });

    res.json({ message: 'Cập nhật thành công', material });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
const remove = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy học liệu' });
    }

    if (req.user.role !== 'admin' && material.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa' });
    }

    await material.destroy();
    res.json({ message: 'Xóa học liệu thành công' });
  } catch (error) {
    next(error);
  }
};

// @desc    Download material
// @route   GET /api/materials/:id/download
const download = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy học liệu' });
    }

    // Track download
    await Download.create({
      user_id: req.user.id,
      material_id: material.id,
    });

    // Increment download count
    await material.increment('download_count');

    const filePath = path.join(__dirname, '../../', material.file_url);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, download };
