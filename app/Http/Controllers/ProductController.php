<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
    // public function store(Request $request)
    // {
    //     // Validate the incoming request data first
    //     $this->validate($request, [
    //         'product_name' =>'required | unique:products| string',
    //         'product_description' =>'required | string',
    //         'product_price' =>'required | numeric',
    //         'category_name' =>'required | string',
    //         'stock'=>'required | numeric',
    //     ]);
    //     // Check if the category name exists in the categories collection
    //     $category = Category::where('category_name', $request->category_name)->first();
    
    //     if (!$category) {
    //         return response()->json(["error" => "Category not found"], 404);
    //     }
    
    //     $product = new Product;
    
    //     $product->product_name = $request->product_name;
    //     $product->product_description = $request->product_description;
    //     $product->product_price = $request->product_price;
    //     $product->category_name = $request->category_name; // Assuming you want to store the category name
    //     $product->stock = $request->stock;
    //     $product->save();
    
    //     return response()->json(["result" => "ok"], 201);
    // }
    

    public function store(Request $request)
    {
        // Validate the incoming request data first
        $this->validate($request, [
            'product_name' => 'required|unique:products|string',
            'product_description' => 'required|string',
            'product_price' => 'required|numeric',
            'category_name' => 'required|string',
            'stock' => 'required|numeric',
            'product_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Add validation for the image
        ]);
    
        // Check if the category name exists in the categories collection
        $category = Category::where('category_name', $request->category_name)->first();
    
        if (!$category) {
            return response()->json(["error" => "Category not found"], 404);
        }
    
        // Handle the file upload using Laravel's Storage facade
        if ($request->hasFile('product_image')) {
            // Store the image in 'public/images' directory inside storage/app/public
            $imagePath = $request->file('product_image')->store('public/images');
    
            // Remove 'public/' from the file path to save the relative path
            $imagePath = str_replace('public/', '', $imagePath);
        }
    
        // Save the product information along with the image path
        $product = new Product;
        
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->category_name = $request->category_name; // Assuming you want to store the category name
        $product->stock = $request->stock;
        $product->product_image = $imagePath; // Store the relative image path in the database
        $product->save();
    
        return response()->json(["result" => "ok"], 201);
    }
    
    
    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        // Retrieve the product by its ID (assuming ID is passed for fetching)
        $product = Product::find($id);
        
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
    public function update(Request $request, $id)
    {
        Log::info('Received update request for product ID: ' . $id);
        // Log incoming request data and files for debugging
        Log::info('Raw request content: ' . $request->getContent());
        Log::info('Request Data: ', $request->all());
        Log::info('Request Files: ', $request->allFiles());
    
        if ($request->hasFile('product_image')) {
            Log::info('Uploaded file: ', [$request->file('product_image')->getClientOriginalName()]);
        } else {
            Log::info('No file uploaded');
        }
    
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string',
            'product_description' => 'required|string',
            'product_price' => 'required|numeric',
            'category_name' => 'required|string',
            'stock' => 'required|numeric',
            'product_image' => 'nullable|image'  // Changed 'required' to 'nullable'
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            Log::info('Validation errors: ', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Find the product by its ID
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
    
        // Check if category exists
        $category = Category::where('category_name', $request->category_name)->first();
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    
        // Update product details
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->category_name = $category->category_name;
        $product->stock = $request->stock;
    
        // Handle file upload if a new image is uploaded
        if ($request->hasFile('product_image')) {
            // Delete the old image if it exists
            if ($product->product_image) {
                Storage::delete('public/' . $product->product_image);
            }
    
            // Store the new image in the 'public' disk (which is storage/app/public)
            $path = $request->file('product_image')->store('public/images');
    
            // Save the relative file path in the database (remove 'public/' prefix)
            $product->product_image = str_replace('public/', '', $path);
        }
        
    
        // Save the updated product
        $product->save();
    
        // Return success response
        return response()->json(['message' => 'Product updated successfully'], 200);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        try {
            // Find the product by its ID or fail
            $product = Product::findOrFail($id);
    
            // Delete the product
            $product->delete();
    
            return response()->json(["message" => "Product deleted successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(["error" => "An error occurred while trying to delete the product."], 500);
        }
    }
    
}
