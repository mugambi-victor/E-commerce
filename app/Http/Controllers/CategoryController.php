<?php

namespace App\Http\Controllers;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories, 200);
    }

    public function store(Request $request)
   {
    $this->validate($request, [
        'category_name' =>'required | unique:categories,category_name| string ',
        'category_description' =>'required | string',
    ]);
       $category = new Category;

       $category->category_name = $request->category_name;
       $category->category_description = $request->category_description;
       $category->save();

       return response()->json(["result" => "ok"], 201);
   }
   public function destroy($id)
{
    // Find the category by ID
    $category = Category::find($id);

    // Check if category exists
    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    // Delete the category
    $category->delete();

    return response()->json(['result' => 'ok'], 200);
}
public function show($id)
{
    // Find the category by ID
    $category = Category::find($id);

    // Check if the category exists
    if ($category) {
        return response()->json($category);
    } else {
        // Return a 404 error if the category is not found
        return response()->json(['message' => 'Category not found'], 404);
    }
}
public function update(Request $request, $id)
{
    // Find the category by ID
    $category = Category::find($id);

    // Check if category exists
    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    // Validate the request data
    $this->validate($request, [
        'category_name' => [
            'required',
            'string',
        ],
        'category_description' => 'required|string',
    ]);

    // Store the old category name for updating related products
    $oldCategoryName = $category->category_name;

    // Update the category details
    $category->category_name = $request->category_name;
    $category->category_description = $request->category_description;
    $category->save();

    // Update products that are using the old category name
    if ($oldCategoryName !== $request->category_name) {
        $products = Product::where('category_name', $oldCategoryName)->get();
        foreach ($products as $product) {
            $product->category_name = $request->category_name;
            $product->save();
        }
    }

    return response()->json(['result' => 'ok', 'category' => $category], 200);
}
 


}
