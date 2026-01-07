import { useState, useEffect, useRef } from "react";
import {
    Plus, Search, Filter, Edit, Trash2, Eye, EyeOff,
    ChevronDown, ChevronRight, FolderTree, Image as ImageIcon,
    Upload, X, Save, Tag, ListOrdered, Percent, FileText,
    Layers, CheckCircle, AlertCircle
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { AdminContainer, AdminHeader, AdminSidebar } from "../../components";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [iconPreview, setIconPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const [expandedCategories, setExpandedCategories] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "order",
        sortOrder: "asc"
    });

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true,
        order: 0,
        removeIcon: false,
        removeImage: false
    });

    // Feature form state
    const [featureForm, setFeatureForm] = useState({
        name: "",
        required: false,
        fieldType: "text",
        options: ""
    });

    // Fetch categories
    // Fetch ALL categories once
    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Remove filters from the API call - get everything
            const { data } = await axiosInstance.get('/api/v1/admin/categories', {
                params: {
                    limit: 1000 // Get a large number or remove limit
                }
            });

            if (data.success) {
                setCategories(data.data.categories);
                setFilteredCategories(data.data.categories); // Initialize with all
            }
        } catch (error) {
            console.error('Fetch categories error:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categories.length === 0) return;

        let filtered = [...categories];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(searchTerm) ||
                (category.description && category.description.toLowerCase().includes(searchTerm))
            );
        }

        // Status filter
        if (filters.status === 'true') {
            filtered = filtered.filter(category => category.isActive === true);
        } else if (filters.status === 'false') {
            filtered = filtered.filter(category => category.isActive === false);
        }

        // Sort
        filtered.sort((a, b) => {
            const aValue = a[filters.sortBy] || 0;
            const bValue = b[filters.sortBy] || 0;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return filters.sortOrder === 'desc'
                    ? bValue.localeCompare(aValue)
                    : aValue.localeCompare(bValue);
            }

            return filters.sortOrder === 'desc'
                ? bValue - aValue
                : aValue - aValue;
        });

        setFilteredCategories(filtered);
    }, [categories, filters]);

    // Initial fetch
    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            sortBy: "order",
            sortOrder: "asc"
        });
    };

    // Handle file upload for icon
    const handleIconUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file for icon');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(file);

            setFormData(prev => ({ ...prev, iconFile: file }));
        }
    };

    // Handle file upload for image
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            setFormData(prev => ({ ...prev, imageFile: file }));
        }
    };

    // Remove icon
    const removeIcon = () => {
        setIconPreview(null);
        setFormData(prev => ({
            ...prev,
            iconFile: null,
            removeIcon: editingCategory?.icon?.url ? true : false
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove image
    const removeImage = () => {
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            imageFile: null,
            removeImage: editingCategory?.image?.url ? true : false
        }));
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            setUploading(true);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append('description', formData.description);
            formDataToSend.append('isActive', formData.isActive);
            formDataToSend.append('order', formData.order);
            formDataToSend.append('removeIcon', formData.removeIcon);
            formDataToSend.append('removeImage', formData.removeImage);

            if (formData.iconFile) {
                formDataToSend.append('icon', formData.iconFile);
            }

            if (formData.imageFile) {
                formDataToSend.append('image', formData.imageFile);
            }

            let response;
            if (editingCategory) {
                // Update category
                response = await axiosInstance.put(
                    `/api/v1/admin/categories/${editingCategory._id}`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                // Create category
                response = await axiosInstance.post(
                    '/api/v1/admin/categories',
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            if (response.data.success) {
                toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
                resetForm();
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setUploading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            isActive: true,
            order: 0,
            removeIcon: false,
            removeImage: false
        });
        setIconPreview(null);
        setImagePreview(null);
        setEditingCategory(null);
        setShowForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    // Edit category
    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || "",
            isActive: category.isActive,
            order: category.order,
            removeIcon: false,
            removeImage: false
        });

        if (category.icon?.url) setIconPreview(category.icon.url);
        if (category.image?.url) setImagePreview(category.image.url);

        setEditingCategory(category);
        setShowForm(true);
    };

    // Delete category
    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const { data } = await axiosInstance.delete(`/api/v1/admin/categories/${categoryToDelete._id}`);

            if (data.success) {
                toast.success('Category deleted successfully');
                setShowDeleteModal(false);
                setCategoryToDelete(null);
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    // Toggle category status
    const toggleStatus = async (category) => {
        try {
            const { data } = await axiosInstance.patch(
                `/api/v1/admin/categories/${category._id}/toggle-status`
            );

            if (data.success) {
                toast.success(`Category ${data.data.category.isActive ? 'activated' : 'deactivated'}`);
                fetchCategories();
            }
        } catch (error) {
            toast.error('Failed to update category status');
        }
    };


    if (loading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="w-full relative">
                    <AdminHeader />
                    <AdminContainer>
                        <div className="flex justify-center items-center min-h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </AdminContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="w-full relative">
                <AdminHeader />
                <AdminContainer>
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold my-5 text-gray-800">
                                    Categories Management
                                </h2>
                                {/* <p className="text-gray-600">
                                    Manage product categories and their specifications
                                </p> */}
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 md:mt-0 flex items-center gap-2 bg-[#edcd1f]/90 hover:bg-[#edcd1f] text-black px-4 py-3 rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                                Add New Category
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <option value="order">Sort by Order</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="createdAt">Sort by Date</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                                Showing {filteredCategories.length} categories
                            </div>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Icon
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCategories.map((category) => (
                                        <tr key={category._id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-3">
                                                        {category.icon?.url ? (
                                                            <img
                                                                src={category.icon.url}
                                                                alt={category.name}
                                                                className="h-10 w-14 rounded-lg object-cover border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                <Tag className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-3">
                                                        {category?.image?.url ? (
                                                            <img
                                                                src={category.image.url}
                                                                alt={category.name}
                                                                className="h-10 w-14 rounded-lg object-cover border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {category.isActive ? (
                                                        <>
                                                            <CheckCircle size={12} />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff size={12} />
                                                            Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(category)}
                                                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                                        title={category.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {category.isActive ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setCategoryToDelete(category);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredCategories.length === 0 && (
                            <div className="text-center py-12">
                                <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories found</h3>
                                <p className="text-gray-500 mb-6">
                                    {filters.search || filters.status !== "all"
                                        ? "No categories match your current filters"
                                        : "Get started by creating your first category"}
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center gap-2 bg-[#edcd1f] hover:bg-[#edcd1f]/90 text-black px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Plus size={18} />
                                    Create Category
                                </button>
                            </div>
                        )}
                    </div>
                </AdminContainer>
            </div>

            {/* Category Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl my-8">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                                </h3>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                            <Tag size={18} />
                                            Basic Information
                                        </h4>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., Sports, Convertibles"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Display Order
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                                Active Category
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Icon Upload */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                            <ImageIcon size={18} />
                                            Category Icon
                                        </h4>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleIconUpload}
                                                accept="image/*"
                                                className="hidden"
                                                id="icon-upload"
                                            />
                                            <label htmlFor="icon-upload" className="cursor-pointer">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    {iconPreview || (editingCategory?.icon?.url && !formData.removeIcon) ? (
                                                        <>
                                                            <img
                                                                src={iconPreview || editingCategory?.icon?.url}
                                                                alt="Icon preview"
                                                                className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                                                            />
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={removeIcon}
                                                                    className="text-sm text-red-600 hover:text-red-800"
                                                                >
                                                                    Remove Icon
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        // Mark icon for removal
                                                                        setFormData(prev => ({ ...prev, removeIcon: true }));
                                                                        setIconPreview(null);
                                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                                    }}
                                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                                >
                                                                    Upload New
                                                                </button>
                                                            </div>
                                                            {formData.removeIcon && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    Icon will be removed on save
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-8 w-8 text-gray-400" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Click to upload icon
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Recommended: 100×100px PNG
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                            <ImageIcon size={18} />
                                            Category Image
                                        </h4>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                ref={imageInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    {imagePreview || (editingCategory?.image?.url && !formData.removeImage) ? (
                                                        <>
                                                            <img
                                                                src={imagePreview || editingCategory?.image?.url}
                                                                alt="Image preview"
                                                                className="h-32 w-full rounded-lg object-cover border border-gray-200"
                                                            />
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={removeImage}
                                                                    className="text-sm text-red-600 hover:text-red-800"
                                                                >
                                                                    Remove Image
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        // Mark image for removal
                                                                        setFormData(prev => ({ ...prev, removeImage: true }));
                                                                        setImagePreview(null);
                                                                        if (imageInputRef.current) imageInputRef.current.value = '';
                                                                    }}
                                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                                >
                                                                    Upload New
                                                                </button>
                                                            </div>
                                                            {formData.removeImage && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    Image will be removed on save
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-8 w-8 text-gray-400" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Click to upload image
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Recommended: 800×400px JPG/PNG
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={uploading}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-3 bg-[#edcd1f] hover:[#edcd1f]/90 text-black rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            {editingCategory ? 'Update Category' : 'Create Category'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && categoryToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">
                                Are you sure you want to delete the category <strong>"{categoryToDelete.name}"</strong>?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-700">
                                    <strong>Warning:</strong> This action cannot be undone. All category images and icons will be permanently deleted from Cloudinary.
                                </p>
                            </div>

                            {categoryToDelete.auctionCount > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Note:</strong> This category has {categoryToDelete.auctionCount} auctions. Deleting the category may affect those auctions.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setCategoryToDelete(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Categories;