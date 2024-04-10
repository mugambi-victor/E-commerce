<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;

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
        'category_name' =>'required | unique| string',
        'category_description' =>'required | string',
    ]);
       $category = new Category;

       $category->category_name = $request->category_name;
       $category->category_description = $request->category_description;
       $category->save();

       return response()->json(["result" => "ok"], 201);
   }
}
