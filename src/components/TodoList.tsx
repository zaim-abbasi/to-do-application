import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Search, Filter, X, Calendar, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  notes?: string;
  tags?: string[];
}

export const TodoList = () => {
  const { toast } = useToast();
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [newTodo, setNewTodo] = React.useState('');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = React.useState('personal');
  const [filter, setFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dueDate, setDueDate] = React.useState<Date>();
  const [notes, setNotes] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [sortBy, setSortBy] = React.useState('date');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast({
        title: "Error",
        description: "Todo text cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority,
      category,
      dueDate,
      notes,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setDueDate(undefined);
    setNotes('');
    setTags('');
    toast({
      title: "Success",
      description: "Todo added successfully",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Success",
      description: "Todo deleted successfully",
    });
  };

  const sortedAndFilteredTodos = React.useMemo(() => {
    let filtered = todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    }).filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'date' && a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [todos, filter, searchQuery, sortBy]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-todo-low';
      case 'medium': return 'bg-todo-medium';
      case 'high': return 'bg-todo-high';
      default: return 'bg-todo-medium';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Todo List
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize your tasks efficiently
        </p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <form onSubmit={addTodo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="w-full bg-gray-50 dark:bg-gray-700"
            />
            
            <div className="flex gap-2">
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !dueDate && "text-muted-foreground"
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Set due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <Input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            className="w-full bg-gray-50 dark:bg-gray-700"
          />

          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary-dark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Todo
          </Button>
        </form>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="flex-1 md:flex-none"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
              className="flex-1 md:flex-none"
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              className="flex-1 md:flex-none"
            >
              Completed
            </Button>
          </div>
        </div>

        <AnimatePresence>
          <div className="space-y-4">
            {sortedAndFilteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="data-[state=checked]:bg-primary"
                />
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </div>
                  {(todo.notes || todo.tags?.length > 0) && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {todo.notes && <div>{todo.notes}</div>}
                      {todo.tags && todo.tags.length > 0 && (
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {todo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {todo.dueDate && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(todo.dueDate), 'MMM d')}
                    </div>
                  )}
                  
                  <span 
                    className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(todo.priority)} 
                      transition-all hover:scale-105`}
                  >
                    {todo.priority}
                  </span>
                  
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm transition-all hover:scale-105">
                    {todo.category}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};