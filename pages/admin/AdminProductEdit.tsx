
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Product, ProductStatus } from '../../types';
import { Input } from '../../components/Form/Input';
import { Textarea } from '../../components/Form/Textarea';
import { Select } from '../../components/Form/Select';
import { Button } from '../../components/Button';
import { useToast } from '../../contexts/ToastContext';

export const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isNew = !id || id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    category: '',
    status: ProductStatus.DRAFT,
    images: [],
    variants: []
  });

  useEffect(() => {
    if (!isNew && id) {
      const loadProduct = async () => {
        try {
          const res = await adminApi.getProductById(id);
          if (res.success && res.data) {
            setFormData(res.data);
          } else {
            showToast('Product not found', 'error');
            navigate('/admin/products');
          }
        } catch (e) {
            showToast('Error loading product', 'error');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, isNew, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: val }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedVariants = [...(prev.variants || [])];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          id: `new-${Date.now()}`,
          name: '',
          sku: '',
          price: prev.price || 0,
          inventory: 0
        } as any
      ]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.saveProduct(formData);
      if (res.success) {
        showToast('Product saved successfully', 'success');
        navigate('/admin/products');
      }
    } catch (err) {
      showToast('Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-900">
              {isNew ? 'New Product' : 'Edit Product'}
            </h1>
            <p className="text-sm text-slate-500">
              {isNew ? 'Import or create a new item.' : `Editing ${formData.title}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Details */}
          <div className="bg-white p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 mb-6">Product Information</h3>
            <div className="space-y-6">
                <Input 
                    label="Title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
                <div className="grid grid-cols-2 gap-6">
                    <Input 
                        label="Price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input 
                        label="Compare at Price" 
                        name="compareAtPrice" 
                        type="number" 
                        step="0.01" 
                        value={formData.compareAtPrice} 
                        onChange={handleChange} 
                    />
                </div>
                <Textarea 
                    label="Description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-8 border border-slate-100 shadow-sm">
             <h3 className="text-lg font-medium text-slate-900 mb-6">Media</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-slate-50 border border-slate-100 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                            className="absolute top-2 right-2 p-1.5 bg-white text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <div className="aspect-square border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors bg-slate-50/50">
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">Add URL</span>
                </div>
             </div>
             <p className="mt-4 text-xs text-slate-400">
                * In a real implementation, this would handle file uploads to S3/Cloudinary.
             </p>
          </div>

          {/* Variants */}
          <div className="bg-white p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-slate-900">Variants</h3>
                <Button type="button" variant="secondary" size="sm" onClick={handleAddVariant}>
                    <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
            </div>
            
            <div className="space-y-6">
                {formData.variants?.map((variant, index) => (
                    <div key={variant.id || index} className="grid grid-cols-12 gap-4 items-start border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                        <div className="col-span-4">
                            <Input 
                                label="Name / Option" 
                                value={variant.name} 
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)} 
                            />
                        </div>
                        <div className="col-span-3">
                            <Input 
                                label="SKU" 
                                value={variant.sku} 
                                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} 
                            />
                        </div>
                        <div className="col-span-2">
                            <Input 
                                label="Price" 
                                type="number" 
                                value={variant.price} 
                                onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))} 
                            />
                        </div>
                        <div className="col-span-2">
                            <Input 
                                label="Stock" 
                                type="number" 
                                value={variant.inventory} 
                                onChange={(e) => handleVariantChange(index, 'inventory', parseInt(e.target.value))} 
                            />
                        </div>
                        <div className="col-span-1 flex justify-end pt-3">
                            <button 
                                type="button" 
                                onClick={() => handleRemoveVariant(index)} 
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {(!formData.variants || formData.variants.length === 0) && (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-sm">
                        <p className="text-sm text-slate-500 mb-2">No variants added.</p>
                        <p className="text-xs text-slate-400">This product will be created with default settings if no variants are specified.</p>
                    </div>
                )}
            </div>
          </div>

        </div>

        {/* Right Column: Organization */}
        <div className="space-y-8">
            
            <div className="bg-white p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Status</h3>
                <Select 
                    label="Product Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'ACTIVE', label: 'Active' },
                        { value: 'DRAFT', label: 'Draft' },
                        { value: 'ARCHIVED', label: 'Archived' }
                    ]}
                />
            </div>

            <div className="bg-white p-6 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Organization</h3>
                <div className="space-y-6">
                    <Input 
                        label="Category" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Supplier" 
                        name="supplier" 
                        value={formData.supplier || ''} 
                        onChange={handleChange} 
                    />
                </div>
            </div>

        </div>
      </div>
    </form>
  );
};
