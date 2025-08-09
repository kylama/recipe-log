import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const trimmedName = name.trim().toLowerCase()

    // Check if another category with this name already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', trimmedName)
      .neq('id', id)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 409 }
      )
    }

    const { data: category, error } = await supabase
      .from('categories')
      .update({ name: trimmedName })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check if any recipes use this category
    const { data: recipesUsingCategory, error: recipesError } = await supabase
      .from('recipes')
      .select('id')
      .eq('category', id)
      .limit(1)

    if (recipesError) {
      console.error('Error checking recipes:', recipesError)
      return NextResponse.json(
        { error: 'Failed to check category usage' },
        { status: 500 }
      )
    }

    if (recipesUsingCategory && recipesUsingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that is being used by recipes. Please reassign those recipes first.' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
