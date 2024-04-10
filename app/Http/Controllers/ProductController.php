<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $products = Product::all();
        return response()->json($products, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data first
        $this->validate($request, [
            'product_name' =>'required | unique:products| string',
            'product_description' =>'required | string',
            'price' =>'required | numeric',
            'category_name' =>'required | string',
        ]);
        // Check if the category name exists in the categories collection
        $category = Category::where('category_name', $request->category_name)->first();
    
        if (!$category) {
            return response()->json(["error" => "Category not found"], 404);
        }
    
        $product = new Product;
    
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->price;
        $product->category_name = $request->category_name; // Assuming you want to store the category name
    
        $product->save();
    
        return response()->json(["result" => "ok"], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $productName)
    {
        // Retrieve the product by its name
        $product = Product::where('product_name', $productName)->first();
    
        if (!$product) {
            return response()->json(["error" => "Product not found"], 404);
        }
    
        return response()->json($product, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
        $this->validate($request, [
            'product_name' =>'required | unique:products| string',
            'product_description' =>'required | string',
            'price' =>'required | numeric',
            'category_name' =>'required | string',
        ]);
        // Check if the category name exists in the categories collection
        $category = Category::where('category_name', $request->category_name)->first();
    }

    /**
     * Remove the specified resource from storage.
     */
    
public function destroy(Request $request, $productName)
{
    // Find the product by its name
    $product = Product::where('product_name', $productName)->first();

    if (!$product) {
        return response()->json(["error" => "Product not found"], 404);
    }

    // Delete the product
    $product->delete();

    return response()->json(["message" => "Product deleted successfully"], 200);
}
}
