import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/recipes/[id] - Fetch a single recipe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching recipe:', error)
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, ingredients, directions, image_url, cook_time, servings, category } = body

    // Validate required fields
    if (!title || !ingredients || !directions) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ingredients, directions' },
        { status: 400 }
      )
    }

    const { data: recipe, error } = await supabase
      .from('recipes')
      .update({
        title,
        ingredients,
        directions,
        image_url: image_url || null,
        cook_time: cook_time ? parseInt(cook_time) : null,
        servings: servings ? parseInt(servings) : null,
        category: category || 'other',
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating recipe:', error)
      return NextResponse.json(
        { error: 'Failed to update recipe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { data, error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Recipe deleted successfully', data });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH endpoint for updating favorite status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json();
    const { is_favorite } = body;

    if (typeof is_favorite !== 'boolean') {
      return NextResponse.json({ error: 'is_favorite must be a boolean' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('recipes')
      .update({ is_favorite })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update favorite error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
