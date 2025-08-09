import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/recipes - Fetch all recipes
export async function GET() {
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching recipes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
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
      .insert([
        {
          title,
          ingredients,
          directions,
          image_url: image_url || null,
          cook_time: cook_time ? parseInt(cook_time) : null,
          servings: servings ? parseInt(servings) : null,
          category: category || 'other',
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating recipe:', error)
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: 500 }
      )
    }

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
