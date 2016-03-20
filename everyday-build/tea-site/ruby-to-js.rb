require "opal"
Opal.append_path File.expand_path('..', __FILE__).untaint

class BeverageQuiz
  attr_reader :answers
  TEAS = {"earl_grey"=>["blue", "1", "sheep"], 
            "green"=>["green", "2", "dog"], 
            "herbal"=>["red", "3", "cat"]}
            
  def initialize(*answers)
    @answers = answers.map(&:to_s)
    p score
  end

  def score
    score = {"earl_grey"=>[], "green"=>[], "herbal"=>[]}
    
    answers.sort.each do |item| 
      score[TEAS.select{|k, v| v.include?(item)}.keys[0]] << item
    end
    
    modes = score.select{|k, v| v == score.values.max}
    "Your best tea match is #{modes.keys[0]} tea!"
  end
end

BeverageQuiz.new(ARGV)